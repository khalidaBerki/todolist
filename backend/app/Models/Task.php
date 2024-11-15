<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Définir les champs modifiables (mass assignable)
    protected $fillable = ['description', 'status', 'completed_at'];

    // Relation avec les tags (si une tâche peut appartenir à plusieurs groupes de tags)
    public function tasks()
    {
        return $this->belongsToMany(TaskTag::class, 'task_tag');
    }

    // Méthode pour calculer la date de complétion (si la tâche devient complète)
    public static function boot()
    {
        parent::boot();

        // Observer pour la mise à jour de la tâche
        static::updating(function ($task) {
            // Si la tâche est marquée comme "complétée", on met à jour la date de completed_at
            if ($task->status === 'complete' && !$task->completed_at) {
                $task->completed_at = now();
            }
        });
    }
}


