import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6">
      <div className="card flex flex-col gap-2 px-4 py-3 text-xs leading-relaxed text-muted sm:px-5">
        <p>
          © {new Date().getFullYear()} {profile.name}. Every number on this site comes from my CV or the project files.
        </p>
        <p>
          Background photos: Lewis Hamilton at the British Grand Prix, Silverstone, by Jen Ross and Andrew &amp; Alan Frost, colour-graded,{" "}
          <a className="-my-3 inline-block py-3 underline hover:text-ink sm:my-0 sm:py-0" href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
            CC BY 2.0
          </a>
          , via{" "}
          <a
            className="-my-3 inline-block py-3 underline hover:text-ink sm:my-0 sm:py-0"
            href="https://commons.wikimedia.org/w/index.php?search=Lewis+Hamilton+British+Grand+Prix&title=Special:MediaSearch&type=image"
            target="_blank"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>
          . Music and sounds are generated in your browser.
        </p>
      </div>
    </footer>
  );
}
