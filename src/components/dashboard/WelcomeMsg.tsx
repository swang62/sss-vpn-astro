interface Props {
  name: string;
}

function WelcomeMsg({ name }: Props) {
  return (
    <p className="bg-muted w-full rounded-lg px-4 py-3">
      Welcome
      {name ? ` ${name}` : ""}! Looks like it's your first time here. This page
      contains important information about your current plan. Click{" "}
      <a href="/dashboard/install" className="text-secondary-link underline">
        here
      </a>{" "}
      to get started.
    </p>
  );
}

export default WelcomeMsg;
