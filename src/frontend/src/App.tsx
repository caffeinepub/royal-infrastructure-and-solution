import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { ArchitecturePage } from "./components/ArchitecturePage";
import { EstimatorPage } from "./components/EstimatorPage";
import { FloorPlansPage } from "./components/FloorPlansPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { PropertiesPage } from "./components/PropertiesPage";

type TabId =
  | "home"
  | "properties"
  | "floorplans"
  | "architecture"
  | "estimator";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "home" && <HomePage onTabChange={handleTabChange} />}
      {activeTab === "properties" && <PropertiesPage />}
      {activeTab === "floorplans" && <FloorPlansPage />}
      {activeTab === "architecture" && <ArchitecturePage />}
      {activeTab === "estimator" && <EstimatorPage />}

      <Footer onTabChange={handleTabChange} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
