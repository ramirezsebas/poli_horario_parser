import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";

enum ErrorCode {
  ERROR_BROWSER_LAUNCH = "ERROR_BROWSER_LAUNCH",
  ERROR_NEW_PAGE = "ERROR_NEW_PAGE",
  ERROR_PAGE_GOTO = "ERROR_PAGE_GOTO",
  ERROR_GET_H3_AND_LINK = "ERROR_GET_H3_AND_LINK",
  ERROR_BROWSER_CLOSE = "ERROR_BROWSER_CLOSE",
}

export async function GET(request: Request) {
  let browser: Browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al iniciar el navegador",
        error: error.toString(),
        error_code: ErrorCode.ERROR_BROWSER_LAUNCH,
      },
      {
        status: 500,
      }
    );
  }

  let page: Page;

  try {
    page = await browser.newPage();
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al abrir una nueva página",
        error: error.toString(),
        error_code: ErrorCode.ERROR_NEW_PAGE,
      },
      {
        status: 500,
      }
    );
  }

  try {
    await page.goto(
      "https://www.pol.una.py/academico/horarios-de-clases-y-examenes/",
      {
        waitUntil: "domcontentloaded",
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al abrir la página",
        error: error.toString(),
        error_code: ErrorCode.ERROR_PAGE_GOTO,
      },
      {
        status: 500,
      }
    );
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
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al obtener el link o titulo",
        error: error.toString(),
        error_code: ErrorCode.ERROR_GET_H3_AND_LINK,
      },
      {
        status: 500,
      }
    );
  }

  try {
    await browser.close();
  } catch (error: any) {
    return NextResponse.json(
      {
        error_client: "Error al cerrar el navegador",
        error: error.toString(),
        error_code: ErrorCode.ERROR_BROWSER_CLOSE,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      title: h3,
      link,
    },
    {
      status: 200,
    }
  );
}
