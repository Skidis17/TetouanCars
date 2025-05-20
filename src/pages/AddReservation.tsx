import React from "react";
import axios from "axios";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  carId: z.string().min(1, "Car is required"),
  clientId: z.string().min(1, "Client is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
  paymentMethod: z.enum(["card", "cash", "bank_transfer"]),
  paymentStatus: z.enum(["paid", "unpaid"]),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  discount: z.number().min(0).max(100).default(0), 
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) < new Date(data.endDate);
  },
  {
    message: "Start date must be before end date",
    path: ["endDate"],
  }
);

const AddReservation = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carId: "",
      clientId: "",
      startDate: "",
      endDate: "",
      paymentMethod: "card",
      paymentStatus: "unpaid",
      totalAmount: 0,
    },
  });

  // Fetch clients for dropdown
  const [clients, setClients] = React.useState<any[]>([]);
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/api/clients")
      .then((res) => setClients(res.data.clients))
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch clients.",
        });
      });
  }, []);

  // Fetch available cars for selected dates
  const [availableCars, setAvailableCars] = React.useState<any[]>([]);
  React.useEffect(() => {
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    if (startDate && endDate) {
      axios
        .get("http://localhost:5000/api/cars/available", {
          params: { start: startDate, end: endDate },
        })
        .then((res) => setAvailableCars(res.data.cars))
        .catch(() => setAvailableCars([]));
    } else {
      setAvailableCars([]);
    }
  }, [form.watch("startDate"), form.watch("endDate")]);

  // Auto-calculate total amount when car or dates change
  React.useEffect(() => {
    const car = availableCars.find((c) => c._id === form.watch("carId"));
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const discount = form.watch("discount") || 0;
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      let total = days * (car.prix_journalier || 0);
      if (discount > 0) {
        total = total - (total * discount) / 100;
      }
      form.setValue("totalAmount", Math.round(total));
    } else {
      form.setValue("totalAmount", 0);
    }
    // eslint-disable-next-line
  }, [
    form.watch("carId"),
    form.watch("startDate"),
    form.watch("endDate"),
    form.watch("discount"),
    availableCars,
  ]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        carId: values.carId,
        clientId: values.clientId,
        reservationDetails: {
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          paymentMethod: values.paymentMethod,
          paymentStatus: values.paymentStatus,
          totalAmount: values.totalAmount,
          discount: values.discount, 
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        payload
      );

      toast({
        title: "Reservation added",
        description: `Reservation #${response.data.id} created successfully`,
      });
      navigate("/reservations");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create reservation",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Car className="h-6 w-6" />
            Add New Reservation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit,
                (errors) => console.log("Validation errors:", errors)
              )}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Car Selection Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vehicle Information</h3>
                  <FormField
                    control={form.control}
                    name="carId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="carId">Voiture</FormLabel>
                        <ReactSelect
                          options={availableCars.map((car) => ({
                            value: car._id,
                            label: `${car.marque} ${car.modele} (${car.immatriculation}) - ${car.couleur}, ${car.prix_journalier}€/jour`,
                          }))}
                          onChange={(option) => field.onChange(option ? option.value : "")}
                          isSearchable
                          placeholder={
                            form.watch("startDate") && form.watch("endDate")
                              ? "Choisir une voiture..."
                              : "Sélectionnez d'abord les dates"
                          }
                          value={
                            availableCars
                              .map((car) => ({
                                value: car._id,
                                label: `${car.marque} ${car.modele} (${car.immatriculation}) - ${car.couleur}, ${car.prix_journalier}€/jour`,
                              }))
                              .find((option) => option.value === field.value) || null
                          }
                          isDisabled={!form.watch("startDate") || !form.watch("endDate")}
                        />
                        {!availableCars.length &&
                          form.watch("startDate") &&
                          form.watch("endDate") && (
                            <div className="text-xs text-red-500 mt-1">
                              Aucune voiture disponible pour ces dates.
                            </div>
                          )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Client Selection Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="clientId">Client</FormLabel>
                        <ReactSelect
                          options={clients.map((client) => ({
                            value: client._id,
                            label: `${client.prenom} ${client.nom} (${client.CIN})`,
                          }))}
                          onChange={(option) => field.onChange(option ? option.value : "")}
                          isSearchable
                          placeholder="Search or select a client..."
                          value={
                            clients
                              .map((client) => ({
                                value: client._id,
                                label: `${client.prenom} ${client.nom} (${client.CIN})`,
                              }))
                              .find((option) => option.value === field.value) || null
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="startDate">Start Date</FormLabel>
                      <FormControl>
                        <Input
                          id="startDate"
                          type="date"
                          {...field}
                          max={form.watch("endDate") || undefined}
                          onChange={(e) => {
                            field.onChange(e);
                            if (
                              form.watch("endDate") &&
                              e.target.value > form.watch("endDate")
                            ) {
                              form.setValue("endDate", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="endDate">End Date</FormLabel>
                      <FormControl>
                        <Input
                          id="endDate"
                          type="date"
                          {...field}
                          min={form.watch("startDate") || undefined}
                          onChange={(e) => {
                            field.onChange(e);
                            if (
                              form.watch("startDate") &&
                              e.target.value < form.watch("startDate")
                            ) {
                              form.setValue("startDate", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="paymentMethod">Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="paymentStatus">Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="paymentStatus">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="totalAmount">Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        id="totalAmount"
                        type="number"
                        {...field}
                        readOnly
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="discount">Remise (%)</FormLabel>
                    <FormControl>
                    <Input
                      id="discount"
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      value={field.value ?? ""}
                      onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/reservations")}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Reservation</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReservation;
