declare namespace T {
    interface DynamicObject<T = any> {
        [key: string]: T;
    }
}
export default T;
