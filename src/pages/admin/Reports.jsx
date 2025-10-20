import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Reports = () => {
  const ridesData = [
    { name: 'Mon', rides: 45 },
    { name: 'Tue', rides: 52 },
    { name: 'Wed', rides: 48 },
    { name: 'Thu', rides: 61 },
    { name: 'Fri', rides: 70 },
    { name: 'Sat', rides: 58 },
    { name: 'Sun', rides: 42 },
  ];

  const revenueData = [
    { name: 'Week 1', revenue: 2100 },
    { name: 'Week 2', revenue: 2400 },
    { name: 'Week 3', revenue: 2200 },
    { name: 'Week 4', revenue: 2800 },
  ];

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="admin" />
      
      <div className="flex flex-1">
        <Sidebar userRole="admin" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Reports & Analytics 📈
            </h1>
            <p className="text-muted-foreground mb-8">
              Track system performance and statistics
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="This Week" value="376" icon="🚗" />
              <StatCard title="Total Revenue" value="$9,500" icon="💰" />
              <StatCard title="New Users" value="87" icon="👥" />
              <StatCard title="Completion Rate" value="94%" icon="✓" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Rides Per Day */}
              <div className="dashboard-card">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Rides Per Day
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ridesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rides" fill="hsl(45, 93%, 47%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Revenue */}
              <div className="dashboard-card">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Weekly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(45, 93%, 47%)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="dashboard-card">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Detailed Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Today
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        This Week
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        This Month
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-secondary">
                      <td className="py-3 px-4 text-foreground">Total Rides</td>
                      <td className="py-3 px-4 text-foreground">48</td>
                      <td className="py-3 px-4 text-foreground">376</td>
                      <td className="py-3 px-4 text-foreground">1,547</td>
                    </tr>
                    <tr className="border-b border-border hover:bg-secondary">
                      <td className="py-3 px-4 text-foreground">New Drivers</td>
                      <td className="py-3 px-4 text-foreground">3</td>
                      <td className="py-3 px-4 text-foreground">21</td>
                      <td className="py-3 px-4 text-foreground">89</td>
                    </tr>
                    <tr className="border-b border-border hover:bg-secondary">
                      <td className="py-3 px-4 text-foreground">New Riders</td>
                      <td className="py-3 px-4 text-foreground">7</td>
                      <td className="py-3 px-4 text-foreground">66</td>
                      <td className="py-3 px-4 text-foreground">234</td>
                    </tr>
                    <tr className="hover:bg-secondary">
                      <td className="py-3 px-4 text-foreground">Revenue</td>
                      <td className="py-3 px-4 text-primary font-bold">$1,320</td>
                      <td className="py-3 px-4 text-primary font-bold">$9,500</td>
                      <td className="py-3 px-4 text-primary font-bold">$52,340</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Reports;
