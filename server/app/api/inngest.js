import { Inngest } from "inngest";
import { serve } from "inngest/next"

const inngest = new Inngest({ name: "Area" });

const serviceSchedules = inngest.createFunction(
    { name: "Send every second Digest" },
    { cron: "0 * * * *" },
    async () => {
        return {
            message: `hello world`,
        }
    }
)
export default serve("Area", [ serviceSchedules ]);
