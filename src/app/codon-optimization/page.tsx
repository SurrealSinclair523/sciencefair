"use client";
import { useState } from "react";
import { Dna } from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function CodonOptimizationPage() {
  const [sequence, setSequence] = useState("");
  const [organism, setOrganism] = useState("human");
  const [optimizedSequence, setOptimizedSequence] = useState("");
  const [cai, setCAI] = useState(0);
  const [gcContent, setGCContent] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const organisms = [
    { value: "human", label: "Human (Homo sapiens)" },
    { value: "mouse", label: "Mouse (Mus musculus)" },
    { value: "e_coli", label: "E. coli (Escherichia coli)" },
    { value: "yeast", label: "Yeast (Saccharomyces cerevisiae)" },
    { value: "arabidopsis", label: "Arabidopsis (Arabidopsis thaliana)" },
    { value: "zebrafish", label: "Zebrafish (Danio rerio)" },
    { value: "drosophila", label: "Fruit Fly (Drosophila melanogaster)" },
    { value: "c_elegans", label: "Nematode (Caenorhabditis elegans)" },
    { value: "rat", label: "Rat (Rattus norvegicus)" },
    { value: "b_subtilis", label: "B. subtilis (Bacillus subtilis)" },
    { value: "p_pastoris", label: "P. pastoris (Pichia pastoris)" },
    { value: "s_pombe", label: "Fission Yeast (Schizosaccharomyces pombe)" },
  ];

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/codon-optimization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequence, organism }),
      });

      const data = await response.json();
      setOptimizedSequence(data.optimizedSequence);
      setCAI(data.cai);
      setGCContent(data.gcContent);
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Dna className="w-6 h-6" />
          Codon Optimization Tool
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Input Sequence</h2>
            <textarea
              className="w-full p-2 border rounded mb-4 min-h-[200px]"
              placeholder="Enter DNA/RNA or protein sequence..."
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
            />

            <div className="mb-4">
              <label className="block mb-2">Select Organism:</label>
              <select
                className="w-full p-2 border rounded"
                value={organism}
                onChange={(e) => setOrganism(e.target.value)}
              >
                {organisms.map((org) => (
                  <option key={org.value} value={org.value}>
                    {org.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
              onClick={handleOptimize}
              disabled={loading || !sequence}
            >
              {loading ? "Optimizing..." : "Optimize Sequence"}
            </button>
          </div>

          {optimizedSequence && (
            <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Optimization Results</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Optimized Sequence</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <pre className="whitespace-pre-wrap break-all">
                      {optimizedSequence}
                    </pre>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <h3 className="font-medium mb-2">Codon Adaptation Index (CAI)</h3>
                    <p className="text-lg font-semibold">{cai.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <h3 className="font-medium mb-2">GC Content</h3>
                    <p className="text-lg font-semibold">{(gcContent * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
