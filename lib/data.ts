import type { CouncilMember, VoteItem } from "@/types";

export const initialMembers: CouncilMember[] = [
  {
    id: "concejal-1",
    name: "Concejal 1",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+1",
  },
  {
    id: "concejal-2",
    name: "Concejal 2",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+2",
  },
  {
    id: "concejal-3",
    name: "Concejal 3",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+3",
  },
  {
    id: "concejal-4",
    name: "Concejal 4",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+4",
  },
  {
    id: "concejal-5",
    name: "Concejal 5",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+5",
  },
  {
    id: "concejal-6",
    name: "Concejal 6",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+6",
  },
  {
    id: "presidente",
    name: "Presidente",
    image: "https://placehold.co/320x320/0f172a/f8fafc?text=Presidente",
  },
];

export const initialVoteItem: VoteItem = {
  id: "votacion-actual",
  title: "Sin votacion activa",
  description: "El administrador debe abrir una nueva votacion.",
  isOpen: false,
};
