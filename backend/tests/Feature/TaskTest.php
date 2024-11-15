<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use App\Models\Task;

class TaskTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test de la création d'une tâche.
     *
     * @return void
     */
    public function testCreateTask()
    {
        // Vérifier si une tâche avec la même description existe déjà
        $existingTask = Task::where('description', 'creation task')->first();

        if (!$existingTask) {
            // Effectuer la mutation GraphQL pour créer une tâche
            $response = $this->postJson('/graphql', [
                'query' => '
                    mutation {
                        createTask(description: "creation task") {
                            id
                            description
                            status
                            created_at
                        }
                    }
                '
            ]);

            // Affiche la réponse brute pour déboguer
            $response->dump();

            // Vérifie si la tâche a bien été créée
            $response->assertStatus(200)
                ->assertJsonPath('data.createTask.description', 'creation task');

            // Vérifier si la tâche est bien présente dans la base de données
            $this->assertDatabaseHas('tasks', [
                'description' => 'creation task',
                'status' => 'en_cours', // Par défaut, le statut doit être 'en_cours'
            ]);
        } else {
            // Si la tâche existe déjà, vous pouvez tester ou gérer autrement
            echo "La tâche existe déjà!";
        }
    }

    /**
     * Test de la mutation de mise à jour du statut d'une tâche.
     *
     * @return void
     */
    public function testUpdateTaskStatus()
    {
        // Créer d'abord une tâche pour pouvoir la mettre à jour
        $task = Task::create([
            'description' => 'task updated',
            'status' => 'en_cours',
        ]);

        // Effectuer la requête GraphQL pour mettre à jour le statut
        $response = $this->postJson('/graphql', [
            'query' => '
                mutation {
                    updateTaskStatus(id: ' . $task->id . ', status: "complete") {
                        id
                        description
                        status
                        created_at
                        completed_at
                    }
                }
            '
        ]);

        // Vérifie que le statut a bien été mis à jour
        $response->assertStatus(200)
            ->assertJsonPath('data.updateTaskStatus.status', 'complete');

        // Vérifie également si le champ completed_at a été mis à jour
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'complete',
            'completed_at' => \DB::raw('completed_at is not null'),
        ]);
    }

    /**
     * Test de la suppression d'une tâche.
     *
     * @return void
     */
    public function testDeleteTask()
    {
        // Créer d'abord une tâche pour pouvoir la supprimer
        $task = Task::create([
            'description' => 'task deleted',
            'status' => 'en_cours',
        ]);

        // Effectuer la requête GraphQL pour supprimer la tâche
        $response = $this->postJson('/graphql', [
            'query' => '
                mutation {
                    deleteTask(id: ' . $task->id . ') {
                        id
                        description
                        status
                    }
                }
            '
        ]);

        // Vérifie que la tâche a bien été supprimée
        $response->assertStatus(200)
            ->assertJsonMissing(['id' => $task->id]); // Vérifie que la tâche n'existe plus

        // Vérifie dans la base de données que la tâche a bien été supprimée
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id
        ]);
    }

    /**
     * Test de la requête pour obtenir toutes les tâches.
     *
     * @return void
     */
    public function testGetTasks()
    {
        // Créer quelques tâches dans la base de données
        $task1 = Task::create([
            'description' => 'Learn GraphQL',
            'status' => 'en_cours',
        ]);

        $task2 = Task::create([
            'description' => 'Complete Laravel project',
            'status' => 'en_cours',
        ]);

        // Effectuer la requête GraphQL pour récupérer toutes les tâches
        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    tasks {
                        id
                        description
                        status
                    }
                }
            '
        ]);

        // Vérifie que la réponse contient bien les tâches créées
        $response->assertStatus(200)
            ->assertJsonFragment([
                'description' => 'Learn GraphQL',
                'status' => 'en_cours',
            ])
            ->assertJsonFragment([
                'description' => 'Complete Laravel project',
                'status' => 'en_cours',
            ]);
    }
}
