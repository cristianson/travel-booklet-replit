import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { insertTravelPreferencesSchema, type InsertTravelPreferences } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const INTERESTS = [
  "Culture & History",
  "Food & Dining",
  "Nature & Outdoors",
  "Shopping",
  "Art & Museums",
  "Nightlife",
  "Adventure Sports",
  "Relaxation"
];

const DINING_PREFERENCES = [
  "Local Cuisine",
  "Fine Dining",
  "Street Food",
  "Vegetarian",
  "Vegan",
  "Seafood",
  "International"
];

const ACTIVITY_LEVELS = [
  "Relaxed",
  "Moderate",
  "Active",
  "Very Active"
];

const BUDGET_MARKS = [
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
];

export function TravelForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertTravelPreferences>({
    resolver: zodResolver(insertTravelPreferencesSchema),
    defaultValues: {
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      interests: [],
      activityLevel: "Moderate",
      diningPreferences: [],
      restaurantBudget: 2,
      additionalNotes: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTravelPreferences) => {
      const res = await apiRequest("POST", "/api/booklets", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your travel booklet is ready."
      });
      setLocation(`/booklet/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Destination */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where do you want to go?</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter destination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full">
                              {format(field.value, "PPP")}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full">
                              {format(field.value, "PPP")}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.watch("startDate")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel>What interests you?</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {INTERESTS.map((interest) => (
                        <FormField
                          key={interest}
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest)}
                                  onCheckedChange={(checked) => {
                                    const interests = field.value || [];
                                    if (checked) {
                                      field.onChange([...interests, interest]);
                                    } else {
                                      field.onChange(interests.filter((i) => i !== interest));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {interest}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Level */}
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Activity Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                      >
                        {ACTIVITY_LEVELS.map((level) => (
                          <FormItem key={level}>
                            <FormControl>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={level} id={level} />
                                <FormLabel htmlFor={level} className="text-sm font-normal">
                                  {level}
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dining Preferences */}
              <FormField
                control={form.control}
                name="diningPreferences"
                render={() => (
                  <FormItem>
                    <FormLabel>Dining Preferences</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {DINING_PREFERENCES.map((pref) => (
                        <FormField
                          key={pref}
                          control={form.control}
                          name="diningPreferences"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(pref)}
                                  onCheckedChange={(checked) => {
                                    const prefs = field.value || [];
                                    if (checked) {
                                      field.onChange([...prefs, pref]);
                                    } else {
                                      field.onChange(prefs.filter((p) => p !== pref));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {pref}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Restaurant Budget Slider */}
              <FormField
                control={form.control}
                name="restaurantBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Budget</FormLabel>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        {BUDGET_MARKS.map(({ value, label }) => (
                          <span
                            key={value}
                            className={`text-sm font-medium ${
                              field.value === value ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={3}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or preferences?"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Travel Booklet"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}