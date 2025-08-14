interface Props {
  name: string;
}

function WelcomeMsg({ name }: Props) {
  return (
    <p className="w-full px-4 py-3 rounded-lg bg-muted">
      Welcome
      {name ? ` ${name}` : ""}
      ! Looks like it's your first time here. This page
      contains important information about your current plan usage. Your profile is being set up as we speak, in the meantime, visit this
      {" "}
      <a href="/dashboard/install" className="underline text-secondary-link">link</a>
      {" "}
      for instructions on how to get connected.
    </p>
  )
  ;
}

export default WelcomeMsg;
