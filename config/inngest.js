import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "quickcart-next" });

// ✅ Lazy imports (fixes Vercel build issues)
const getDB = async () => {
  const connectDB = (await import("./db")).default;
  const User = (await import("@/models/user")).default;
  return { connectDB, User };
};

// ✅ Create user
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { connectDB, User } = await getDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// ✅ Update user
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { connectDB, User } = await getDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// ✅ Delete user
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { connectDB, User } = await getDB();

    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id); // ✅ FIXED
  }
);