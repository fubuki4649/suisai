import {Card, Chip, Separator} from "@heroui/react";
import {Icon} from "@iconify/react";
import React from "react";

export interface MetadataCardProps {
  file_name: string;
  size_on_disk: number;
  photo_date: Date;
  photo_timezone: string;
  resolution_width: number;
  resolution_height: number;
  mime_type: string;
  camera_model: string;
  lens_model: string;
  shutter_count: number;
  focal_length: number;
  iso: number;
  shutter_speed: string;
  aperture: number;
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Chip
        size="lg"
        variant="secondary"
        color="accent"
        className="w-8 h-8 p-0 flex items-center justify-center rounded-lg shrink-0"
      >
        <Icon icon={icon} className="w-4 h-4" />
      </Chip>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium tracking-wider text-muted">{label}</span>
        <span
          className="text-sm font-medium text-foreground truncate tabular-nums leading-snug select-text"
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function MetaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Separator className="my-1" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted tracking-wider">{title}</p>
        {children}
      </div>
    </>
  );
}

function MetadataCard(props: MetadataCardProps) {
  const { formattedDate, formattedTime } = React.useMemo(() => {
    const timeZone = props.photo_timezone || undefined;
    const formattedDate = props.photo_date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    });

    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
      timeZoneName: "short",
    }).formatToParts(props.photo_date);

    const tzName = parts.find((p) => p.type === "timeZoneName")?.value;
    const timeOnly = parts
      .filter((p) => ["hour", "minute", "literal", "dayPeriod"].includes(p.type))
      .map((p) => p.value)
      .join("")
      .trim();

    return {
      formattedDate,
      formattedTime: tzName ? `${timeOnly} (${tzName})` : timeOnly,
    };
  }, [props.photo_date, props.photo_timezone]);

  const megapixels = ((props.resolution_width * props.resolution_height) / 1_000_000).toFixed(1);
  const sizeMB = (props.size_on_disk / (1024 * 1024)).toFixed(2);
  const fileFormat = props.mime_type?.replace(/^image\//i, "").toUpperCase() || "IMAGE";

  return (
    <Card className="w-72 rounded-2xl bg-surface border border-separator shadow-xl p-4 select-none">
      {/* Header: File Name & Format Badge */}
      <div className="flex flex-col gap-1.5 select-text">
        <div className="flex justify-between gap-2 items-center">
          <h3 className="font-bold text-lg truncate text-foreground tracking-tight flex-1" title={props.file_name}>
            {props.file_name}
          </h3>
          <Chip size="md" color="accent" variant="soft" className="font-semibold">
            {fileFormat}
          </Chip>
        </div>

        {/* Technical specs: Dimensions, MP, File Size */}
        <div className="flex items-center gap-1 text-sm font-medium text-muted tabular-nums">
          <span>{props.resolution_width} × {props.resolution_height}</span>
          <span className="text-separator">•</span>
          <span>{megapixels} MP</span>
          <span className="text-separator">•</span>
          <span>{sizeMB} MB</span>
        </div>
      </div>

      <MetaSection title="Exposure">
        <div className="grid grid-cols-2 gap-2.5">
          <MetaItem icon="gravity-ui:target" label="Focal" value={`${props.focal_length} mm`} />
          <MetaItem icon="gravity-ui:aperture" label="Aperture" value={`ƒ/${props.aperture.toFixed(1)}`} />
          <MetaItem icon="gravity-ui:stopwatch" label="Shutter" value={props.shutter_speed} />
          <MetaItem icon="gravity-ui:sliders" label="ISO" value={props.iso} />
        </div>
      </MetaSection>

      <MetaSection title="Equipment">
        <div className="flex flex-col gap-2.5">
          <MetaItem icon="gravity-ui:camera" label="Camera" value={props.camera_model || "Unknown Camera"} />
          <MetaItem icon="gravity-ui:circles-concentric" label="Lens" value={props.lens_model || "Unknown Lens"} />
        </div>
      </MetaSection>

      <MetaSection title="Details">
        <div className="flex flex-col gap-2.5">
          <MetaItem icon="gravity-ui:calendar" label="Date" value={formattedDate} />
          <MetaItem icon="gravity-ui:clock" label="Time" value={formattedTime} />
          {props.shutter_count > 0 && (
            <MetaItem icon="gravity-ui:layers" label="Shutter Count" value={props.shutter_count.toLocaleString()} />
          )}
        </div>
      </MetaSection>
    </Card>
  );
}

export default MetadataCard;
