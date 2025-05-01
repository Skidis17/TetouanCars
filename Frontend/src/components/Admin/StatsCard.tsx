import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <motion.div
          className={`${color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </motion.div>
      </div>
    </div>
  );
};