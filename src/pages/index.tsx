import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="simple">Simple</TabsTrigger>
                <TabsTrigger value="aquis">Aquis</TabsTrigger>
            </TabsList>
            <TabsContent value="simple">Simple flow</TabsContent>
            <TabsContent value="aquis">Aquis flow</TabsContent>
        </Tabs>
    </div>
  );
}
