'use client';
import React, { useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const App = () => {
  const [markdownResponse, setMarkdownResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const uploadFile = (e) => {
    const files = [...e.target.files];
    if (!files.length) {
      return;
    }
    console.log(files);

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('myfiles', files[i]);
    }
    fetch("http://localhost:5000/uploadfile", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded");
        res.json().then((data) => {
          console.log(data);
          const { file, url } = data;
          console.log(url);

          setImageUrl(url);
          run(file);
        });
      }
    });
  };

  const run = async ({ uri, mimeType }) => {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    // const files = [
    //   await uploadToGemini("cake.jpg", "image/jpeg"),
    // ];

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType,
                fileUri: uri,
              },
            },
            {
              text: "Based on the ingredients in these images, suggest three diverse recipes. For each recipe, provide a name and a list of its main ingredients.",
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
    setMarkdownResponse(result.response.text());
  };

  return (
    <div className="min-h-screen">
      <div className="h-[50vh] flex flex-col justify-center max-w-[80%] mx-auto">
        <h1 className="text-5xl font-bold text-center my-6">
          What's My Recipe
        </h1>
        <label htmlFor="image-upload" className="cursor-pointer border p-5">
          Upload Your Image Here ...
        </label>
        <input
          multiple
          accept="image/*"
          id="image-upload"
          type="file"
          className="hidden"
          onChange={uploadFile}
        />
      </div>
      <div className="max-w-[80%] mx-auto">
        {imageUrl && <img className="w-50 mx-auto my-5" src={imageUrl} />}
        {markdownResponse && (
          <MarkdownPreview
            source={markdownResponse}
            style={{ padding: 16, borderRadius: 10 }}
          />
        )}
      </div>
    </div>
  );
};

export default App;