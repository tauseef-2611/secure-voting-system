import { CardWithForm } from "./login";

export default function Home() {
  console.log(process.env.MONGODB_URI);

  return (
    <div className="flex w-full justify-center items-center min-h-screen">
      <CardWithForm />
    </div>
  );
}