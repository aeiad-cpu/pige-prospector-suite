import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/AppLayout";
import GlobalRules from "@/components/automatisation/GlobalRules";
import TabSequences from "@/components/automatisation/TabSequences";
import TabSMS from "@/components/automatisation/TabSMS";
import TabWhatsApp from "@/components/automatisation/TabWhatsApp";
import TabPaP from "@/components/automatisation/TabPaP";
import TabAgentIA from "@/components/automatisation/TabAgentIA";

const Automatisation = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Automatisation</h1>
        <p className="text-sm text-muted-foreground mt-1">Tour de contrôle des cadences de prospection</p>
      </div>

      <GlobalRules />

      <Tabs defaultValue="sequences" className="w-full">
        <TabsList className="bg-card border border-border mb-4 h-10">
          <TabsTrigger value="sequences" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Séquences
          </TabsTrigger>
          <TabsTrigger value="sms" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            SMS
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="pap" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            PàP
          </TabsTrigger>
          <TabsTrigger value="agent-ia" className="font-display text-xs uppercase tracking-wider data-[state=active]:bg-violet-600 data-[state=active]:text-white">
            🤖 Agent IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequences"><TabSequences /></TabsContent>
        <TabsContent value="sms"><TabSMS /></TabsContent>
        <TabsContent value="whatsapp"><TabWhatsApp /></TabsContent>
        <TabsContent value="pap"><TabPaP /></TabsContent>
        <TabsContent value="agent-ia"><TabAgentIA /></TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Automatisation;
