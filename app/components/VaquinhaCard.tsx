"use client";

import { useState } from "react";
import type { Vaquinha } from "@/lib/types";
import { BaseCard } from "./BaseCard";
import { ContributionModal } from "./ContributionModal";

type VaquinhaCardProps = {
  vaquinha: Vaquinha;
};

export function VaquinhaCard({ vaquinha }: VaquinhaCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const footer = (
    <p className="text-sm text-gray-900 font-medium text-center">
      Clique para contribuir
    </p>
  );

  return (
    <>
      <BaseCard
        title={vaquinha.title}
        description={vaquinha.description}
        imageUrl={vaquinha.imageUrl}
        footer={footer}
        onClick={() => setModalOpen(true)}
      />

      <ContributionModal
        vaquinha={vaquinha}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
