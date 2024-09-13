import { Button } from "@/components/ui/button"; // 需要根据shadcn的button组件路径进行修改

interface ImgUploadProps {
  onChange: (file: File | null) => void;
}

const ImgUpload: React.FC<ImgUploadProps> = ({ onChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <div className=" w-full px-4 mt-4">
      <Button className=" w-full" onClick={handleButtonClick}>
        Upload Image
      </Button>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImgUpload;
