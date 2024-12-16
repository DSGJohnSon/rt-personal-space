import { usePathname } from "next/navigation";
import React from "react";

export default function LanguageSelector() {
  const currentUrl = usePathname();
  const urlParts = currentUrl.split("/");
  const locale = urlParts[1];
  let path = "";
  if (urlParts.length > 1) {
    path = urlParts.slice(1).join("/");
  }

  return (
    <>
      <ul className="flex gap-4 font-axiforma">
        <li
          className={`cursor-pointer hover:text-tangelo-500 transition ${
            locale == "fr" ? "font-semibold text-tangelo-500" : ""
          }`}>
          <a href={"/fr/" + path} title="Switch to french">
            <p>fr</p>
          </a>
        </li>
        <li
          className={`cursor-pointer hover:text-tangelo-500 transition ${
            locale == "en" ? "font-semibold text-tangelo-500" : ""
          }`}>
          <a href={"/en/" + path} title="Switch to english">
            <p>en</p>
          </a>
        </li>
        <li
          className={`cursor-pointer hover:text-tangelo-500 transition ${
            locale == "jp" ? "font-semibold text-tangelo-500" : ""
          }`}>
          <a href={"/jp/" + path} title="Switch to japanese">
            <p>jp</p>
          </a>
        </li>
      </ul>
    </>
  );
}
