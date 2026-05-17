import { currentUser } from "@clerk/nextjs/server";
import { History, User as UserIcon } from "lucide-react";
import { getUserOrders } from "@/src/lib/users/user-orders.service";
import { ProfileOrdersSection } from "@/src/components/profile/profile-orders-section";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h2 className="text-2xl font-bold text-base-content mb-2">
            You must be logged in
          </h2>
          <p className="text-base-content/70 max-w-md mx-auto">
            Please sign in to view your profile and order history.
          </p>
        </div>
      </div>
    );
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Profile Header */}
      <section className="mb-8">
        <div className="bg-base-100 border border-base-content/10 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-base-content/70">{user.emailAddresses[0]?.emailAddress}</p>
              <p className="text-sm text-base-content/50">Member since {new Date(user.createdAt!).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order History Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <History className="w-6 h-6" />
            Order History
          </h2>
          <p className="text-base-content/70">View all your past orders and their status</p>
        </div>

        <ProfileOrdersSection orders={orders} userName={`${user.firstName} ${user.lastName}`} />
      </section>
    </div>
  );
}
