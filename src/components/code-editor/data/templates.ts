import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { Extension } from "@codemirror/state";
export const templates: Record<string, string> = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    javascript: `function main() {
    console.log("Hello, World!");
}

main();`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};

export const getLanguageExtension = (lang: string): Extension => {
    switch (lang) {
        case "cpp":
            return cpp();
        case "python":
            return python();
        case "java":
            return java();
        default:
            return javascript();
    }
}