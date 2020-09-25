interface ActionSpace{
    sample()
}
interface Reward {

}
interface StepResult<Obs>{
    observation: Obs;
    reward: number;
    done: boolean;
    info: string;
}
interface IGym<State,Action> {
    actionSpace: ActionSpace;
    render(): Promise<void>;
    reset(): Promise<State>;
    state(): Promise<State>;
    step(action:Action): Promise<StepResult<State>>;
}