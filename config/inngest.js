import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "quickcart-next" });

// ✅ Lazy imports
const getDB = async () => {
  const connectDB = (await import("./db")).default;
  const User = (await import("@/models/user")).default;
  return { connectDB, User };
};

// ✅ CREATE
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }], // ✅ FIXED
  },
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

// ✅ UPDATE
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }], // ✅ FIXED
  },
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

// ✅ DELETE
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }], // ✅ FIXED
  },
  async ({ event }) => {
    const { connectDB, User } = await getDB();

    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);