
export namespace FLLScoreClientConstants {
    export const WELCOME = /^Welcome:[0-9]+(\r\n)*$/;
    export const ECHO = /^Echo:(\r\n)*$/;
    export const SCORE_HEADER = /^Score Header:[a-zA-Z0-9\/:]+(\|[0-9]+){3}(\r\n)*$/;
    export const SCORE = /^Score:[0-9]+\|.+(\|(-1|[0-9]+)){4}(\r\n)*$/;
    export const SCORE_DONE = /^Score Done:(\r\n)*$/;
    export const LAST_UPDATE = /^Last Update:.+(\r\n)*$/;
}
