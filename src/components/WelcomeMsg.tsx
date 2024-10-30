import { useCookies } from "react-cookie";

interface Props {
  showedWelcome?: string;
}

function WelcomeMsg({ showedWelcome }: Props) {
  const [_, setCookie] = useCookies(["showedWelcome"]);

  const shouldShow = !showedWelcome;
  if (shouldShow) {
    // Immediately set the cookie to indicate shown welcome msg
    setCookie("showedWelcome", "true", { maxAge: 2147483647, path: "/dashboard", sameSite: "lax" });
  }

  return shouldShow && (
    <p className="w-full px-4 py-3 rounded-lg bg-muted">
      Welcome! Looks like it's your first time here. This is your homepage which
      contains important information about your current usage. Visit this
      {" "}
      <a href="/dashboard/install" className="underline text-secondary-link" data-astro-reload>link</a>
      {" "}
      for instructions on how to get connected.
    </p>
  )
  ;
}

export default WelcomeMsg;
