import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";

export async function GET(request: Request) {
  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  let page: Page;

  try {
    page = await browser.newPage();
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  try {
    await page.goto(
      "https://www.pol.una.py/academico/horarios-de-clases-y-examenes/",
      {
        waitUntil: "domcontentloaded",
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  let h3;
  let link;

  try {
    const bodyHandle = await page.$(".elementor.elementor-1100");

    h3 = await page.evaluate((body) => {
      const element = body?.querySelector("h3");

      return element?.textContent;
    }, bodyHandle);

    link = await page.evaluate((body) => {
      const element = body?.querySelector(
        ".elementor-text-editor.elementor-clearfix"
      );

      const allParagraphs = element?.querySelectorAll("p");

      const link = allParagraphs?.[1]?.querySelector("a");

      return link?.href;
    }, bodyHandle);

    await bodyHandle?.dispose();
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  try {
    await browser.close();
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }

  return NextResponse.json({
    title: h3,
    link,
  });
}
