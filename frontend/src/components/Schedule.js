function Schedule() {
  return (
    // <!-- ============ WORKOUT SCHEDULE ============ -->
<section class="section schedule-section">
  <div class="container">
    <div class="section-head text-center reveal-up">
      <p class="eyebrow">Timetable</p>
      <h2 class="section-title">Weekly <span class="text-accent">schedule.</span></h2>
    </div>

    <div class="table-responsive reveal-up mt-4">
      <table class="table schedule-table align-middle">
        <thead>
          <tr>
            <th>Day</th>
            <th>Workout</th>
            <th>Time</th>
            <th>Trainer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Day">Monday</td>
            <td data-label="Workout"><span class="tag-pill tag-strength">Strength</span></td>
            <td data-label="Time">06:00 – 07:00</td>
            <td data-label="Trainer">Marcus Reid</td>
          </tr>
          <tr>
            <td data-label="Day">Tuesday</td>
            <td data-label="Workout"><span class="tag-pill tag-cardio">Cardio</span></td>
            <td data-label="Time">07:30 – 08:30</td>
            <td data-label="Trainer">Sofia Alvarez</td>
          </tr>
          <tr>
            <td data-label="Day">Wednesday</td>
            <td data-label="Workout"><span class="tag-pill tag-crossfit">CrossFit</span></td>
            <td data-label="Time">18:00 – 19:00</td>
            <td data-label="Trainer">Elena Cruz</td>
          </tr>
          <tr>
            <td data-label="Day">Thursday</td>
            <td data-label="Workout"><span class="tag-pill tag-strength">Strength</span></td>
            <td data-label="Time">06:00 – 07:00</td>
            <td data-label="Trainer">Marcus Reid</td>
          </tr>
          <tr>
            <td data-label="Day">Friday</td>
            <td data-label="Workout"><span class="tag-pill tag-nutrition">Recovery</span></td>
            <td data-label="Time">17:00 – 18:00</td>
            <td data-label="Trainer">Jason Kim</td>
          </tr>
          <tr>
            <td data-label="Day">Saturday</td>
            <td data-label="Workout"><span class="tag-pill tag-crossfit">CrossFit</span></td>
            <td data-label="Time">09:00 – 10:30</td>
            <td data-label="Trainer">Elena Cruz</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

       );
    }
export default Schedule;
