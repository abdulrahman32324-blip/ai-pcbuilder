export const translations = {
    en: {
        header: "AI PCBuilder",
        hero: {
            badge: "✨ Build Your Gaming PC with AI ✨",
            title: "AI PCBuilder",
            subtitle: "Enter your budget and get AI-generated gaming PC builds optimized for performance.",
        },
        form: {
            title: "Generate Your Perfect Build",
            currency: "Currency",
            budget: "Budget",
            builds: "Number of Builds",
            purpose: "Primary Use",
            performanceTier: "Performance Tier",
            notes: "Additional Notes (Optional)",
            notesPlaceholder: "e.g., 'I prefer a white case', 'Need WiFi motherboard'",
            generate: "Generate Builds",
            generating: "Generating...",
        },
        results: {
            title: "Generated Builds",
            performance: "Est. Performance",
            components: "Components",
            totalPrice: "Total Price",
            estPrice: "Est. Price",
            wattage: "Est. Wattage",
            targetPerformance: "Target Performance",
            gamePerformance: "Game Performance",
            game: "Game",
            fps: "FPS",
            settings: "Settings",
            save: "Save",
            saved: "Saved",
            compare: "Compare",
            comparing: "Comparing",
            pdf: "PDF",
            share: "Share",
            copy: "Copy",
            copied: "Copied!",
        },
        comparison: {
            title: "Build Comparison",
            feature: "Feature",
            build1: "Build 1",
            build2: "Build 2",
        },
        footer: {
            copyright: `© ${new Date().getFullYear()} AI PCBuilder. All rights reserved.`,
            about: "About",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
        },
        modals: {
            about: {
                title: "About AI PCBuilder",
                content: "AI PCBuilder is an innovative platform that leverages the power of generative AI to help gamers create their perfect PC builds. We believe that building a custom PC should be an accessible and exciting experience for everyone, regardless of their technical expertise. Our AI analyzes millions of component combinations to find the optimal build for your specific budget and performance needs, taking the guesswork out of the process."
            },
            terms: {
                title: "Terms of Service",
                content: "By using AI PCBuilder, you agree to our terms. The builds generated are for informational purposes only and based on AI analysis; prices and component availability are subject to change. We are not responsible for any purchasing decisions made based on the information provided. The service is provided 'as is' without warranties of any kind."
            },
            privacy: {
                title: "Privacy Policy",
                content: "We respect your privacy. AI PCBuilder does not collect or store any personal information from its users. All build generation data is processed anonymously. We use local storage on your browser to save your builds and preferences, but this data never leaves your device and is not accessible by us. We do not use cookies for tracking."
            },
        },
        savedBuilds: {
            title: "Your Saved Builds"
        },
        share: {
            text: "Check out this awesome gaming PC build from AI PCBuilder!",
            via: "via  PC Builder"
        },
        error: {
            title: "An Error Occurred",
            generationFailed: "Failed to generate builds. The AI might be busy or an error occurred. Please try again later.",
            noResponse: "The AI did not return a valid response. Please try adjusting your budget or try again.",
            invalidFormat: "The AI returned an invalid data format. Could not parse the builds.",
            apiError: "An API error occurred",
            safety: "The request was blocked due to safety settings. Please try a different prompt.",
            unknown: "An unknown error occurred.",
        },
        loading: {
            title: "Crafting Your Builds...",
            message: "Our AI is analyzing the best components for your budget. This may take a moment."
        },
        prompt: {
            base: `You are an expert PC builder. Generate {count} complete PC builds for a budget of {budget} {currency}. The user's primary use for this PC is '{purpose}' and they are looking for a '{performanceTier}' performance tier. The builds must be optimized for this purpose and performance level. For each build, provide a unique name, a list of components (CPU, GPU, Motherboard, RAM, Storage, PSU, Case) with their individual estimated prices, key specs for each component (e.g., '16GB DDR5 6000MHz' for RAM), estimated power draw for CPU and GPU, the total price, total estimated wattage, a target resolution (e.g., '1080p', '1440p', '4K') the build is optimized for, an estimated average FPS as a number for that resolution across modern AAA games, a one-sentence performance summary, and estimated performance in popular games like Fortnite and Warzone. Also provide a plausible Amazon search URL for each component, formatted as 'https://www.amazon.com/s?k=COMPONENT_NAME&tag=deazlly-20'. The total price must not exceed the budget. Respond in valid JSON format according to the provided schema.`,
            notes: ` The user also provided these additional notes: '{notes}'. Please take these into consideration.`
        }
    },
};