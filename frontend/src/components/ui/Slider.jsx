import * as SliderPrimitive from "@radix-ui/react-slider";

export function Slider({ value, onValueChange, min = 0, max = 50, step = 1 }) {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="bg-gray-200 relative flex-1 h-1 rounded-full">
        <SliderPrimitive.Range className="absolute bg-orange-500 h-1 rounded-full" />
      </SliderPrimitive.Track>
      {value.map((val, idx) => (
        <SliderPrimitive.Thumb
          key={idx}
          className="block w-5 h-5 bg-orange-600 rounded-full shadow cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
