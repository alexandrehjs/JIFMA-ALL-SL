import React from "react";
import { Link } from "react-router-dom";
import { Zap, Award, BarChart3, File } from "lucide-react";
import IFLogo from "@/assets/if_logo_1.png";
import Bira from "@/assets/bira/bira_completo.svg";
import BiraBasquete from "@/assets/bira/bira_basquete.svg";
import BiraVolei from "@/assets/bira/bira_volei.svg";
import BiraNatacao from "@/assets/bira/bira_natacao.svg";

const Home = () => {
  const principals = [
    { name: "Democracia" },
    { name: "Conhecimento" },
    { name: "Educação" },
    { name: "Cidadania" },
    { name: "Humanização" },
    { name: "Sustentabilidade" },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-gree-700 to-green-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 opacity-15 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  relative z-10">
          <div className="text-center">
            <div className="animate-bounce">
              <img src={IFLogo} className=" w-16 mx-auto mb-6" />
            </div>
            <div className="flex flex-col space-y-2 mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in flex flex-col">
                JIFMA 2025
              </h1>
              <span className="text-4xl">Polo 3</span>
            </div>

            <p className="text-md md:text-xl mb-8 text-white">
              Os Jogos do Instituto Federal do Maranhão (JIFMA) são promovidos
              pelo IFMA em articulação com a Coordenação de Arte, Cultura e
              Desporto da Pro-Reitoria de Ensino e Assuntos Estudantis (Prenae).
              Baseados nas diretrizes educacionais, visam normatizar e
              disciplinar o desenvolvimento harmônico da etapa estadual.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-1 ">
              {principals.map((principal, index) => (
                <div
                  key={index}
                  className={`w-full rounded-xl p-6 text-center text-white transition-all duration-300 transfor cursor-pointer`}
                >
                  <h3 className="text-lg font-semibold">{principal.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mascote Bira
            </h2>
            <p className="text-xl text-gray-600">
              Símbolo da leveza, da resistência e da identidade cultural do
              Maranhão, Bira foi escolhida por votação pública para representar
              a X edição dos Jogos Estudantis do IFMA Polo 3
            </p>
            <div className="flex flex-row justify-center space-x-8 flex-wrap space-y-5 mt-5">
              <img
                src={Bira}
                alt="Símbolo da leveza, da resistência e da identidade cultural do Maranhão, Bira foi escolhida por votação pública para representar a X edição dos Jogos Estudantis do IFMA"
                className="w-56"
              />
              <img src={BiraBasquete} alt="Bira do Basquete" className="w-56" />
              <img src={BiraNatacao} alt="Bira da Natação" className="w-56" />
              <img src={BiraVolei} alt="Bira do Vôlei" className="w-56" />
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Equipe e Infraestrutura
            </h2>
            <p className="text-xl text-gray-600">
              Em breve apresentaremos a nossa equipe e infraestrutura
              responsáveis pelo JIFMA Etapa Estadual 2025
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Regulamentos
            </h2>
            <p className="text-xl text-gray-600">
              Os jogos seguem a Lei nº 9.615/1998 e se baseiam em desporto
              educacional, sem seletividade extrema, visando formação cidadã e
              desporto de participação voluntário, promovendo saúde e
              integração.
            </p>

            <div className="flex flex-row w-full justify-center mt-8 space-x-10">
              <a
                className="text-xl text-blue-500 hover:underline"
                href="https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTdiZDZhODY0MGMyODcwMzk0YTA3YjE0MzIxZjk2MFt8XTAwMV9Qcm9ncmFtYV9JbnN0aXR1Y2lvbmFsX1JFSVRfUkVHVUxBTUVOVE9fSklGTUFfMjAyNS5wZGY="
              >
                Regulamento Geral da Etapa Estadual 2025
              </a>
              {/* <a
                className="text-xl text-blue-500 hover:underline"
                href="https://caxias.ifma.edu.br/wp-content/uploads/sites/27/2025/06/REGULAMENTOS-ESPECIFICOS-JIFMA-COMPLETO-E-ATUALIZADO.pdf"
              >
                Regulamento das Modalidades da Etapa Polo 3
              </a> */}
            </div>

            
          </div>
        </div>
      </section>
      
      
      {/* new newsletter section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Boletins
            </h2>
            <p className="text-xl text-gray-600">
              Boletins informativos dos jogos da Etapa Estadual do JIFMA 2025
            </p>

            <div className="flex flex-row w-full justify-center mt-8 space-x-10">
              <a
                className="text-xl text-blue-500 hover:underline"
                href="../../public/boletins/boletim-01.pdf"
                target="_blank"
              >
                Boletim 01
              </a>

              <a
                className="text-xl text-blue-500 hover:underline"
                href="../../public/boletins/boletim-02.pdf"
                target="_blank"
              >
                Boletim 02
              </a>
            </div>

            
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Zap className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Acompanhe Todos os Resultados
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Fique por dentro de tudo que acontece no JIFMA Polo 3 2025
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/resultados"
                className="inline-flex items-center space-x-2 bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <BarChart3 size={20} />
                <span>Ver Resultados</span>
              </Link>
              <Link
                to="/noticias"
                className="inline-flex items-center space-x-2 bg-yellow-500 text-green-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                <span>Ver Últimas Notícias</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
