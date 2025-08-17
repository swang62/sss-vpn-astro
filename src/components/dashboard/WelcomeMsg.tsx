interface Props {
  name: string;
}

function WelcomeMsg({ name }: Props) {
  return (
    <p className="bg-muted w-full rounded-lg px-4 py-3">
      Welcome
      {name ? ` ${name}` : ""}! Looks like it's your first time here. This page
      contains important information about your current plan usage. Your profile
      is being set up right now, in the meantime, click{" "}
      <a href="/dashboard/install" className="text-secondary-link underline">
        here
      </a>{" "}
      for instructions on how to access the VPN on all your devices.
    </p>
  );
}

export default WelcomeMsg;
