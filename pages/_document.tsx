import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/png" href="/logo.png" />

        {/* SEO */}
        <meta name="keyword" content={"kadai, kada, shijangme"} />
        <meta
          name={"description"}
          content={
            "Buy and sell products anywhere anytime in South Korea. Best Products at Best prices on Kadai | " +
            "Покупайте и продавайте товары в любое время в любом месте Южной Кореи. Лучшие товары по лучшим ценам на Kadai!" +
            "어디서든 언제든지 한국에서 제품을 사고파세요. Kadai에서 최고의 제품을 최저가로 만나보세요!"
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
