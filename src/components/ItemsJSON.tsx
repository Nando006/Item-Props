import { Toast } from "primereact/toast";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface Item {
  visible?: boolean;
  title?: string;
  singleFile?: boolean;
}

interface Props {
  fileSize: number;
  label: string;
  name: string;
  file?: Item;
}

// Validação do tamanho do arquivo
const validateFileSize = (file: File | null, size: number): boolean => {
  const maxFileSize = size * 1024 * 1024;
  if (file && file.size > maxFileSize) {
    return false;
  }
  return true;
};

export default function ItemsJSON({ fileSize, label, name, file }: Props) {
  const toast = useRef<Toast>(null);

  // Controla qual aba está visivel
  const [activeTab, setActiveTab] = useState<"file" | "image">("file");

  // Parte de Arquivos ----------------------------------------------
  const [selectFile, setSelectFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);

      // Limita a seleção a um arquivo se singleFile for true
      const files = file?.singleFile ? [filesArray[0]] : filesArray;

      // Realiza a validação do tamanho antes de chamar o upload
      const validFiles = files.filter((file) =>
        validateFileSize(file, fileSize),
      );

      if (validFiles.length !== files.length) {
        messageValidationSizeFiles();
      }

      setSelectFile(files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files);
      const files = file?.singleFile ? [filesArray[0]] : filesArray;
      const validFiles = files.filter((file) =>
        validateFileSize(file, fileSize),
      );

      if (validFiles.length !== files.length) {
        messageValidationSizeFiles();
      }

      setSelectFile(files);
    }
  };

  // Evento acionado quando o usuário esta arrastando o arquivo sobre a área designada
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Impede o comportamento padrão do navegador durante o evento de "drag over"
  };

  // Essa função simula o click no input file
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Gerenciar items
  const removeFile = (index: number) => {
    setSelectFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Parte de Arquivos ----------------------------------------------

  const messageValidationSizeFiles = () => {
    toast.current?.show({
      severity: "warn",
      summary: `Tamanho máximo excedido`,
      detail: `Alguns arquivos excedem o limite de tamanho permitido.`,
      life: 3000,
    });
  };

  return (
    <div className="">
      <Toast ref={toast} position="top-right" />
      <aside>
        <span className="font-bold mb-2 pl-1 text-2xl">{label}</span>
      </aside>
      <div className="border-2 border-gray-600/40 rounded-lg p-5">
        <ul className="flex flex-row items-center space-x-4 px-5 py-2 font-semibold border border-gray-600/30 rounded-lg">
          <li>
            <button
              className={`border  px-3 py-1 rounded-md duration-300 cursor-pointer ${
                activeTab === "file"
                  ? "bg-blue-300 border-blue-500"
                  : "border-gray-300 hover:bg-blue-200 hover:border-blue-300"
              }`}
              onClick={() => setActiveTab("file")}
            >
              Arquivo
            </button>
          </li>
          <li>
            <button
              className={`border px-3 py-1 rounded-md duration-300 cursor-pointer ${
                activeTab === "image"
                  ? "bg-blue-300 border-blue-500"
                  : "border-gray-300 hover:bg-blue-200 hover:border-blue-300"
              }`}
              onClick={() => setActiveTab("image")}
            >
              Imagem
            </button>
          </li>
        </ul>
        {activeTab === "file" && file && file.visible && (
          <aside className="p-1 bg-white rounded-lg ">
            <label htmlFor="dropzone-file">
              <div
                className="group h-[150px] cursor-pointer border-4 border-dashed border-gray-400 px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:border-blue-400 duration-300"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={openFileDialog}
              >
                <div className="flex flex-col items-center justify-center space-y-5">
                  <span className="text-2xl text-gray-800/60 group-hover:text-blue-800/60 duration-300">
                    Selecione os Arquivos ou Arraste aqui
                  </span>
                  <i
                    className="pi pi-file-arrow-up text-gray-800/40 group-hover:text-blue-800/40 duration-300"
                    style={{ fontSize: "4rem" }}
                  />
                </div>
                <input
                  type="file"
                  id="dropzone-file"
                  multiple={!file?.singleFile}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ods,.xls,.xlsx"
                  className="hidden absolute"
                />
                <input className="h-14 w-56 z-100" type="hidden" id={name} />
              </div>
            </label>
          </aside>
        )}
        {/* Lista de arquivos selecionados */}

        {activeTab === "file" && selectFile.length > 0 && (
          <aside>
            <div className="mt-3">
              <h3 className="font-bold mb-2">Arquivos Selecionados:</h3>
              <ul className="bg-gray-50 p-3 rounded-lg shadow-sm">
                {selectFile.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded-md shadow mb-2"
                  >
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
        {/* Componente de Upload de Imagem (futuro) */}
        {activeTab === "image" && (
          <aside className="p-1 bg-white rounded-lg">
            <div className="group h-[150px] cursor-pointer border-4 border-dashed border-gray-400 px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 hover:border-blue-400 duration-300">
              <span className="text-gray-600">
                Componente de Upload de Imagem em construção...
              </span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
