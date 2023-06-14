import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgdMUvhQG7nwFmtDXmixnAvxywNn5ITJM",
  authDomain: "quizwhiz-fc853.firebaseapp.com",
  projectId: "quizwhiz-fc853",
  storageBucket: "quizwhiz-fc853.appspot.com",
  messagingSenderId: "544661130883",
  appId: "1:544661130883:web:241bf2b75acfe0a5ee15b6",
  measurementId: "G-J34S6PEB1R"
};
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();

export { firebaseApp, auth };