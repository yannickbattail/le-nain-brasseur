import { IRecipeReference } from './IRecipeReference';
import { AnalysisLevel } from './AnalysisLevel.js';

export interface IRecipe extends IRecipeReference {
    score?: number;
    problem: string;
    analysisLevel: AnalysisLevel;
    recipeRef?: IRecipeReference;
}
