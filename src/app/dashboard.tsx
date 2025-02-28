
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/utils/auth";

export default function Dashboard() {
    const router = useRouter();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
        } else {
            setMessage("Welcome to your dashboard!");
        }
    }, []);

    return <h2>{message}</h2>;
}