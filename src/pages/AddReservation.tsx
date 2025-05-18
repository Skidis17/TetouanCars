
import React from "react";
import axios from "axios";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Car, Calendar, Upload } from "lucide-react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  // Car Details
  model: z.string().min(2, "Model must be at least 2 characters"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  licensePlate: z.string().min(4, "License plate must be at least 4 characters"),
  fuelType: z.enum(["electric", "hybrid", "gasoline"]),
  mileage: z.number().min(0, "Mileage must be positive"),
  pricePerDay: z.number().min(0, "Price per day must be positive"),
  color: z.string().min(2, "Color must be at least 2 characters"),
  seats: z.number().min(2).max(9),
  hasGPS: z.boolean().default(false),
  hasAC: z.boolean().default(false),

 // Client selection
  clientId: z.string().min(1, "Client is required"),

  // Reservation Details
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
  paymentMethod: z.enum(["card", "cash", "bank_transfer"]),
  paymentStatus: z.enum(["paid", "unpaid"]),
  totalAmount: z.number().min(0, "Total amount must be positive"),
});

const AddReservation = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      brand: "",
      licensePlate: "",
      fuelType: "gasoline", // Default to a valid option
      mileage: 0,
      pricePerDay: 0,
      color: "", // Add default value
      seats: 2, // Add default value
      hasGPS: false,
      hasAC: false,
      clientId: "",
      startDate: "",
      endDate: "",
      paymentMethod: "card", // Default to a valid option
      paymentStatus: "unpaid", // Default to a valid option
      totalAmount: 0, 
    },
  });


    // Fetch clients for dropdown
    const [clients, setClients] = React.useState<any[]>([]);
    React.useEffect(() => {
      axios
        .get("http://localhost:5000/api/clients")
        .then((res) => setClients(res.data.clients))
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch clients.",
          });
        });
    }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    try {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const totalAmount = days * values.pricePerDay;
  
      // Format dates to ISO string
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
  
      const payload = {
        carDetails: {
          marque: values.brand,  // Changed from brand to marque
          modele: values.model,  // Changed from model to modele
          plaque_immatriculation: values.licensePlate,
          type_carburant: values.fuelType,
          kilometrage: values.mileage,
          prix_journalier: values.pricePerDay,
          couleur: values.color,
          nombre_places: values.seats,
          options: [
            ...(values.hasGPS ? ["GPS"] : []),
            ...(values.hasAC ? ["Climatisation"] : [])
          ]
        },
        clientId: values.clientId,
        reservationDetails: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          paymentMethod: values.paymentMethod,
          paymentStatus: values.paymentStatus,
          totalAmount: totalAmount
        }
      };
  
      console.log("Payload being sent:", payload);  // Debug log
  
      const response = await axios.post("http://localhost:5000/api/reservations", payload);
      
      console.log("Response from server:", response.data);  // Debug log
      
      toast({
        title: "Reservation added",
        description: `Reservation #${response.data.id} created successfully`,
      });
      navigate("/reservations");
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || 
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
              (errors) => console.log("Validation errors:", errors) // Debug log
            )}
            className="space-y-6"
          >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Car Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vehicle Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="model">Model</FormLabel>
                        <FormControl>
                          <Input id="model" placeholder="e.g., Camry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="brand">Brand</FormLabel>
                        <FormControl>
                          <Input id="brand" placeholder="e.g., Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="color">Color</FormLabel>
                        <FormControl>
                          <Input id="color" placeholder="e.g., Red" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="seats">Seats</FormLabel>
                        <FormControl>
                          <Input
                            id="seats"
                            type="number"
                            placeholder="e.g., 5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
                        <FormControl>
                          <Input id="licensePlate" placeholder="e.g., ABC-123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fuelType">Fuel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger id="fuelType">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="gasoline">Gasoline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="mileage">Mileage</FormLabel>
                          <FormControl>
                            <Input
                              id="mileage"
                              type="number"
                              placeholder="e.g., 50000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="pricePerDay">Price per Day</FormLabel>
                          <FormControl>
                            <Input
                              id="pricePerDay"
                              type="number"
                              placeholder="e.g., 100"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
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
                            placeholder="e.g., 100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Options</h4>
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="hasGPS"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">GPS</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasAC"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Climate Control</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
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
                          options={clients.map(client => ({
                            value: client._id,
                            label: `${client.prenom} ${client.nom} (${client.email})`
                          }))}
                          onChange={option => field.onChange(option ? option.value : "")}
                          isSearchable
                          placeholder="Search or select a client..."
                          value={
                            clients
                              .map(client => ({
                                value: client._id,
                                label: `${client.prenom} ${client.nom} (${client.email})`
                              }))
                              .find(option => option.value === field.value) || null
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <FormControl>
                      <Input id="startDate" type="date" {...field} />
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
                      <Input id="endDate" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
