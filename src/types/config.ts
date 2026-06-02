export interface FileType {
    key: string;
    file: string;
}

export interface SpriteFileType extends FileType {
    frameWidth: number;
    frameHeight: number;
}

export interface DefaultSoundType {
    volume: number;
    delay: number;
    nextWait: number;
}

interface DefaultImageType {
    scale: { x: number; y: number };
    origin: { x: number; y: number };
}

export interface SoundType extends Partial<DefaultSoundType> {
    key: string;
}

interface ImageType extends Partial<DefaultImageType> {
    key: string;
}

interface RelatedContentType {
    key: string;
    conId: number;
    conGroupId?: number;
    type: "video" | "module" | "flash";
}

interface FileConfigType {
    [key: string]: { sound?: FileType[]; image?: FileType[]; sprite?: SpriteFileType[] };
}

interface SceneType {
    bg: ImageType;
    bgm?: SoundType;
    startSound?: SoundType[];
    relatedContent?: RelatedContentType[];
}

interface ModuleConfigType {
    defaultsSound: DefaultSoundType;
    defaultsImage: DefaultImageType;
    scene: { [key: string]: SceneType };
}

export interface ConfigType {
    type: string;
    version: string;
    name: string;
    portraitMode: boolean;
    conId: number;
    file: FileConfigType;
    module: ModuleConfigType;
}
