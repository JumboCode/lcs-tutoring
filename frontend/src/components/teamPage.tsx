import anaDias from "../assets/images/eboard_headshots/AnaDias_scaled.png";
import christinaZheng from "../assets/images/eboard_headshots/ChristinaZheng_scaled.png";
import mollySikma from "../assets/images/eboard_headshots/MollySikma_scaled.png";
import aoifeDeClercq from "../assets/images/eboard_headshots/AoifeDeClercq_scaled.png";
import nikkiYip from "../assets/images/eboard_headshots/NikkiYip_scaled.png";
import sabrinaAquino from "../assets/images/eboard_headshots/SabrinaAquino_scaled.png";
import aatiqahAziz from "../assets/images/eboard_headshots/AatiqahAziz_scaled.png";

import BoardBox from "./boardBox";

export default function TeamPage() {
  return (
    <>
      <div
        className={
          "flex flex-row items-center w-[90%] lg:w-[90%] mx-auto mt-20 md:mt-32 mb-8"
        }
      >
        <h3 className={"font-interBlack text-[#1F3A68] text-3xl"}>
          MEET OUR TEAM
        </h3>
        <hr className={"w-10 h-0.5 mx-3 rounded border-0 bg-[#E4D1F0]"} />
      </div>
      <div className={"flex flex-col lg:w-[90%] mx-auto"}>
        <div
          className={
            "flex flex-col lg:flex-row items-center justify-center my-3 lg:my-8 gap-y-8 lg:gap-x-8"
          }
        >
          <BoardBox
            photo={anaDias}
            name={"Ana Dias"}
            title={"CO-PRESIDENT"}
            year={"2025"}
            bio={
              "I am a rising senior double majoring in biology and \
              biotechnology at Tufts University! I also am \
              studying DNA repair and damage tolerance in \
              Drosophila melanogaster in the McVey Lab at Tufts."
            }
          />
          <BoardBox
            photo={christinaZheng}
            name={"Christina Zheng"}
            title={"CO-PRESIDENT & MEDIA"}
            year={"2025"}
            bio={
              "I've been tutoring since my freshman year, and now \
              as a senior, it's still one of the highlights of my \
              week!"
            }
          />
        </div>
        <div
          className={
            "flex flex-col lg:flex-row items-center justify-center my-3 lg:my-8 lg:gap-y-0 gap-y-8 lg:gap-x-8"
          }
        >
          <BoardBox
            photo={mollySikma}
            name={"Molly Sikma"}
            title={"VICE PRESIDENT"}
            year={"2026"}
            bio={
              "I am a junior at Tufts University, majoring in \
              Biopsychology and minoring in Medical Anthropology \
              on the pre-medical track. I have been a part of \
              LCS Tutoring for the past three years, and I love \
              working with kids. I enjoys swimming, reading, and \
              is learning how to draw with oil pastels in my free time!"
            }
          />
          <BoardBox
            photo={aoifeDeClercq}
            name={"Aoife Declercq"}
            title={"TREASURER"}
            year={"2027"}
            bio={
              "I’m a sophomore majoring in biomedical engineering \
              on a pre-med track, and I'm currently tutoring a high \
              schooler with a focus on math and science."
            }
          />
        </div>
        <div
          className={
            "flex flex-col lg:flex-row items-center justify-center my-3 lg:my-8 gap-y-8 lg:gap-x-8"
          }
        >
          <BoardBox
            photo={nikkiYip}
            name={"Nikki Yip"}
            title={"TREASURER"}
            year={"2025"}
            bio={
              "Hii! My name is Nikki and I'm currently a senior \
              double majoring in Biology and Child Study/Human Development. \
              I'm from Los Angeles, California and some things I enjoy \
              doing in my free time are running, swimming, and \
              exploring new places!"
            }
          />
          <BoardBox
            photo={sabrinaAquino}
            name={"Sabrina Aquino"}
            title={"TUTOR COORDINATOR"}
            year={"2027"}
            bio={
              "I am majoring in biopsychology. Ask me about movie \
              recs and Filipino culture!"
            }
          />
        </div>
        <div className={"flex flex-row justify-center mb-28 my-3"}>
          <BoardBox
            photo={aatiqahAziz}
            name={"Aatiqah Aziz"}
            title={"FAMILY COORDINATOR"}
            year={"2026"}
            bio={
              "I am a junior at Tufts University majoring in Community \
              Health and minoring in Asian American studies. I have \
              been a part of LCS Tutoring for 3 years and I  handle \
              the communication between tutors and families. I enjoy \
              traveling, trying new restaurants, and painting in my \
              free time!"
            }
          />
        </div>
      </div>
      <div className="h-400 bg-[#FBFDFE] pt-8 md:pt-28 pb-16">
        <div
          className={"flex flex-col w-[95vw] lg:w-[80vw] xl:w-[70vw] mx-auto"}
        >
          <div className={"flex flex-row items-center my-8 md:my-16"}>
            <h3 className={"font-interBlack text-[#1F3A68] text-3xl"}>
              CONTACT US
            </h3>
            <hr className={"w-10 h-0.5 mx-3 rounded border-0 bg-[#E4D1F0]"} />
          </div>
          {/* Laptop Display */}
          <div className="hidden md:block">
            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-col my-8"}>
                <h3 className={"text-[#7D7D7D] text-4xl"}>
                  Find us on Instagram
                </h3>
                <h3 className={"text-[#7D7D7D] text-4xl my-5"}>Email us</h3>
              </div>
              <div className={"flex flex-col my-8"}>
                <a
                  href="https://www.instagram.com/lcstutors/"
                  className={"text-[#1F3A68] text-4xl"}
                >
                  @LCSTutors
                </a>
                <a
                  href="mailto:lcs.tutors@gmail.com"
                  className={"text-[#1F3A68] text-4xl my-5"}
                >
                  lcs.tutors@gmail.com
                </a>
              </div>
            </div>
          </div>
          {/* Mobile Display */}
          <div className="block md:hidden">
            <div className="flex flex-col">
              <div className="flex flex-row justify-between my-4">
                <h3 className="text-[#7D7D7D] text-2xl">
                  Find us on Instagram
                </h3>
                <a
                  href="https://www.instagram.com/lcstutors/"
                  className="text-[#1F3A68] text-2xl"
                >
                  @LCSTutors
                </a>
              </div>
              <div className="flex flex-row justify-between my-4">
                <h3 className="text-[#7D7D7D] text-2xl">Email us</h3>
                <a
                  href="mailto:lcs.tutors@gmail.com"
                  className="text-[#1F3A68] text-2xl"
                >
                  lcs.tutors@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
