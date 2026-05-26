import type { PhaseData } from '../types/game'

import pikaia from '../assets/pikaia_gracilens.png'
import ordovician from '../assets/ordovician_ocean.png'
import seaScorpion from '../assets/pterygotus_sea_scorpion.png'
import plankton from '../assets/tiny_plankton_cluster.png'
import doliodus from '../assets/doliodus_problematicus.png'
import devonian from '../assets/devonian_ocean.png'
import dunkleosteus from '../assets/dunkleosteus_terrelli.png'
import smallFish from '../assets/small_school_fish.png'
import stethacanthus from '../assets/stethacanthus_shark.png'
import carboniferous from '../assets/carboniferous_ocean.png'
import hybodus from '../assets/hybodus_shark.png'
import triassic from '../assets/triassic_ocean.png'
import mosasaurus from '../assets/mosasaurus.png'
import megalodon from '../assets/megalodon_shark.png'
import miocene from '../assets/miocene_ocean.png'
import tuna from '../assets/bluefin_tuna.png'
import greatWhite from '../assets/great_white_shark.png'
import modern from '../assets/modern_ocean.png'
import orca from '../assets/orca_killer_whale.png'

export const phases: PhaseData[] = [
  {
    id: 1,
    name: 'Pikaja',
    era: 'Ordovicijum — 450 miliona godina pre nove ere',
    duration: 90,
    sharkSprite: pikaia,
    backgroundImage: ordovician,
    backgroundColor: '#0a1628',
    predatorSprites: [seaScorpion],
    foodSprite: plankton,
    predatorCount: 2,
    foodCount: 25,
    predatorSpeed: 1.5,
    playerSpeed: 3,
    fact: {
      title: 'Mutacija',
      definition:
        'Promena genetskog materijala koja može dovesti do novih osobina.',
      creatureFact:
        'Pikaja je jedna od prvih poznatih hordata — predaka svih kičmenjaka, uključujući ajkule i ljude. Duga je svega 5 cm.',
      adaptationGained: 'Osnovna kičma — omogućava kontrolisano kretanje',
    },
    specialMechanic: null,
  },
  {
    id: 2,
    era: 'Devon — 380 miliona godina pre nove ere',
    name: 'Doliodus',
    duration: 90,
    sharkSprite: doliodus,
    backgroundImage: devonian,
    backgroundColor: '#0d1f1a',
    predatorSprites: [dunkleosteus],
    foodSprite: smallFish,
    predatorCount: 2,
    foodCount: 25,
    predatorSpeed: 2,
    playerSpeed: 3.5,
    fact: {
      title: 'Prirodna selekcija',
      definition:
        'Bolje prilagođene jedinke imaju veću šansu da prežive i razmnože se.',
      creatureFact:
        'Doliodus problematicus je najstarija poznata ajkula, stara 409 miliona godina. Imala je i peraje i zube — kombinacija koja je bila revolucionarna.',
      adaptationGained: 'Vilice sa zubima — prva prava ajkula',
    },
    specialMechanic: null,
  },
  {
    id: 3,
    name: 'Stethacanthus',
    era: 'Karbon — 320 miliona godina pre nove ere',
    duration: 100,
    sharkSprite: stethacanthus,
    backgroundImage: carboniferous,
    backgroundColor: '#060d1a',
    predatorSprites: [dunkleosteus],
    foodSprite: smallFish,
    predatorCount: 3,
    foodCount: 25,
    predatorSpeed: 2,
    playerSpeed: 3.5,
    fact: {
      title: 'Seksualna selekcija',
      definition:
        'Osobine koje povećavaju šansu za parenje prenose se na sledeće generacije.',
      creatureFact:
        'Stethacanthus je imao čudnu nakovanjsku peraju na leđima za koju naučnici misle da je služila za privlačenje partnera ili zastrašivanje predatora.',
      adaptationGained: 'Dorsalna peraja — stabilizacija i komunikacija',
    },
    specialMechanic: 'current',
  },
  {
    id: 4,
    name: 'Hybodus',
    era: 'Trijas — 240 miliona godina pre nove ere',
    duration: 100,
    sharkSprite: hybodus,
    backgroundImage: triassic,
    backgroundColor: '#111820',
    predatorSprites: [mosasaurus],
    foodSprite: smallFish,
    predatorCount: 3,
    foodCount: 25,
    predatorSpeed: 2.5,
    playerSpeed: 4,
    fact: {
      title: 'Genetski drift',
      definition:
        'Neke osobine se šire slučajno kroz populaciju, bez direktne prednosti.',
      creatureFact:
        'Hybodus je preživeo Permsko masovno izumiranje koje je ubilo 96% morskog života. Tajna — dva tipa zuba: šiljasti za hvatanje i tupi za drobljenje školjki.',
      adaptationGained: 'Dva tipa zuba — maksimalna fleksibilnost ishrane',
    },
    specialMechanic: 'asteroid',
  },
  {
    id: 5,
    name: 'Megalodon',
    era: 'Miocen — 15 miliona godina pre nove ere',
    duration: 100,
    sharkSprite: megalodon,
    backgroundImage: miocene,
    backgroundColor: '#061520',
    predatorSprites: [orca],
    foodSprite: tuna,
    predatorCount: 1,
    foodCount: 25,
    predatorSpeed: 2.2,
    playerSpeed: 4.5,
    fact: {
      title: 'Adaptacija',
      definition:
        'Osobina koja povećava šansu organizma za preživljavanje u datoj sredini.',
      creatureFact:
        'Megalodon je bio najveći morski predator ikad — do 18 metara dužine. Njegov zub bio je veći od ljudske šake. Izumro je pre 3.6 miliona godina.',
      adaptationGained: 'Maksimalna veličina — nema prirodnih neprijatelja',
    },
    specialMechanic: 'predator-mode',
  },
  {
    id: 6,
    name: 'Bela ajkula',
    era: 'Danas',
    duration: 90,
    sharkSprite: greatWhite,
    backgroundImage: modern,
    backgroundColor: '#0a1520',
    predatorSprites: [orca],
    foodSprite: tuna,
    predatorCount: 2,
    foodCount: 25,
    predatorSpeed: 2.5,
    playerSpeed: 4,
    fact: {
      title: 'Uticaj čoveka',
      definition:
        'Ljudska aktivnost menja ekosisteme brže nego što se vrste mogu prilagoditi.',
      creatureFact:
        'Bela ajkula postoji 11 miliona godina. Danas je ugrožena vrsta — procenjuje se da ih ima manje od 3.500 u celom okeanu.',
      adaptationGained: null,
    },
    specialMechanic: 'nets',
  },
]
