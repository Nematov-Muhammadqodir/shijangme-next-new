import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/png" href="/favicon.ico" />

        {/* SEO */}
        <meta name="keyword" content={"jone, jeyone, j.one"} />
        <meta
          name={"description"}
          content={
            "Buy and sell products anywhere anytime in South Korea. Best Products at Best prices on j.one | " +
            "Покупайте и продавайте товары в любое время в любом месте Южной Кореи. Лучшие товары по лучшим ценам на j.one!" +
            "어디서든 언제든지 한국에서 제품을 사고파세요. J.one에서 최고의 제품을 최저가로 만나보세요!"
          }
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
