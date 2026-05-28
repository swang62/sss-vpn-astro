interface Props {
  name: string;
}

function WelcomeMsg({ name }: Props) {
  return (
    <p className="bg-muted w-full rounded-lg px-4 py-3">
      Welcome
      {name ? ` ${name}` : ""}! Looks like it's your first time here. The main
      dashboard page contains important information about your current plan like
      data usage and subscription status. To get started, click{" "}
      <a href="/dashboard/install" className="text-secondary-link underline">
        here
      </a>{" "}
      to begin the installation process.
    </p>
  );
}

export default WelcomeMsg;
