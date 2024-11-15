<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('description');
        $table->timestamp('created_at')->useCurrent();
        $table->enum('status', ['en_cours', 'complete'])->default('en_cours');
        $table->timestamp('completed_at')->nullable();
        $table->timestamp('updated_at')->nullable();
    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
