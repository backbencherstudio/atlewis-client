import SpeechPlayer from "@/components/speech";

export default function page() {
    const text = "Hello, world!"
    return <SpeechPlayer text={text} />;
}
