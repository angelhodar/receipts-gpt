"use client";

export default function UploadReceipt() {
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    const url = new URL("/api/upload", window.origin)

    url.searchParams.append("file", file.name)
    url.searchParams.append("fileType", file.type)

    const res = await fetch(url.href);

    const { url: uploadUrl, fields } = await res.json();

    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const upload = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
    } else {
      console.error("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2">
      <input
        onChange={uploadPhoto}
        type="file"
        accept="image/*"
        className="p-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        PNG, JPG or GIF (max 10MB)
      </p>
    </div>
  );
}
