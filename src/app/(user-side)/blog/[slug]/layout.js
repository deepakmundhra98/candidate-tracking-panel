import { Inter } from "next/font/google";
import "../../../globals.css";
import Head from "next/head";
import BaseAPI from "@/app/BaseAPI/BaseAPI";
import Domain from "@/app/BaseAPI/Domain";
import 'bootstrap/dist/css/bootstrap.min.css';


const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params, searchParams }, parent) {
//   Fetch data
  const product = await fetch(`${BaseAPI}/blog/getMetadataBySlug/${params.slug}`,{
    cache: "no-store",
  }).then((res) =>
    res.json()
  );



  let pageSlug = params;

  let totalData = product.response.blogData;

  // let schemaOrg = null;
  // if(text){
  //   const cleanedText = text
  //     .replace(/\\r\\n/g, '')   // Remove \r\n (carriage return + newline)
  //     .replace(/\\n/g, '')      // Remove \n (newline)
  //     .replace(/\\r/g, '')      // Remove \r (carriage return)
  //     .replace(/\\+/g, '')      // Remove unnecessary backslashes
  //     .replace(/[\u0000-\u001F\u007F]/g, '');  // Remove control characters


  //     schemaOrg = cleanedText && JSON.parse(cleanedText);

  // }

  // Return metadata
  return {
    title: totalData.meta_title,
    description: totalData.meta_description,
    keywords: totalData.meta_keyword,
    // Add other meta tags as needed
    alternates: {
      canonical: `${Domain}/blog/${pageSlug.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    schemaOrg: totalData.schema || null,
  };
}

export default async function RootLayout({ children, params, searchParams }) {
  // Fetch metadata using the generateMetadata function
  const metadata = await generateMetadata({ params, searchParams });
 

  return (
    <html lang="en">
      <Head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <title>{metadata.title}</title>
      </Head>
      <body className={inter.className}>{children}

         
      </body>
     
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.schemaOrg) }}
      />
    </html>
  );
}