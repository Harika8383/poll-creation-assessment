import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertPollSchema, type InsertPoll } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Create() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertPoll>({
    resolver: zodResolver(insertPollSchema),
    defaultValues: {
      question: "Which Java version are you currently using in production?",
      options: ["Java 8", "Java 11"]
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InsertPoll) => {
      const res = await apiRequest("POST", "/api/polls", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Poll created successfully!" });
      navigate(`/poll/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create poll",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const addOption = () => {
    const currentOptions = [...form.getValues("options")];
    currentOptions.push("");
    form.setValue("options", currentOptions, { shouldValidate: true });
  };

  const removeOption = (index: number) => {
    const currentOptions = [...form.getValues("options")];
    if (currentOptions.length > 2) {
      currentOptions.splice(index, 1);
      form.setValue("options", currentOptions, { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Polls
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="What's your question?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Options (minimum 2 required)</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                  {form.watch("options").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`options.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder={`Option ${index + 1}`} {...field} />
                              {form.getValues("options").length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  Create Poll
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}