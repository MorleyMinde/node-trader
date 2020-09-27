interface ActionSpace{
    sample()
}
interface Reward {

}
interface StepResult<State>{
    state: State;
    reward: number;
    done: boolean;
    info: string;
}
interface IGym<State,Action> {
    actionSpace: ActionSpace;
    render(): Promise<void>;
    reset(): Promise<State>;
    step(action:Action): Promise<StepResult<State>>;
}