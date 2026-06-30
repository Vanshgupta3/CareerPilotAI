import Card from "../ui/Card";
import Badge from "../ui/Badge";

function DashboardPreview() {
    return (
        <Card className="w-full max-w-md shadow-2xl">

            <div className="flex justify-between items-center">

                <h2 className="text-white text-xl font-semibold">
                    Resume Analysis
                </h2>

                <Badge>
                    AI Powered
                </Badge>

            </div>

            <div className="mt-8">

                <p className="text-slate-400">
                    ATS Score
                </p>

                <h1 className="text-6xl font-bold text-blue-500 mt-2">
                    88
                </h1>

            </div>

            <div className="mt-8">

                <div className="flex justify-between text-sm text-slate-400">

                    <span>Resume Quality</span>

                    <span>88%</span>

                </div>

                <div className="w-full bg-slate-700 rounded-full h-3 mt-2">

                    <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: "88%" }}
                    />

                </div>

            </div>

            <div className="mt-8 flex flex-wrap gap-3">

                <Badge>React</Badge>

                <Badge>Node.js</Badge>

                <Badge>Express</Badge>

                <Badge>Prisma</Badge>

            </div>

        </Card>
    );
}

export default DashboardPreview;