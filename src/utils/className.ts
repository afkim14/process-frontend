class ClassName {
    constructor() {}
    combine = (classNames: Array<string>) => {
        return classNames.filter((cn) => cn !== '').join(' ');
    }
}

const ClassNameSingleton = new ClassName();
export default ClassNameSingleton;